import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, Timestamp, orderBy, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface ProjectData {
  id: string;
  userId: string;
  name: string;
  identity: any;
  technical: any;
  brand: any;
  sections: any[];
  isDeleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ActivityLog {
  id: string;
  userId: string;
  projectId: string;
  action: string;
  details: string;
  timestamp: Timestamp;
}

export const createProject = async (name: string, identity: any, technical: any, brand: any, sections: any[]) => {
  if (!auth.currentUser) throw new Error("Must be logged in to create a project");
  
  const projectId = crypto.randomUUID();
  const time = Timestamp.now();
  const pathForWrite = `projects/${projectId}`;
  
  try {
    await setDoc(doc(db, 'projects', projectId), {
      userId: auth.currentUser.uid,
      name: name || 'Untitled Project',
      identity,
      technical,
      brand,
      sections,
      isDeleted: false,
      createdAt: time,
      updatedAt: time,
    });
    
    await logActivity(projectId, 'Created project', `Initial creation of ${name || 'Untitled Project'}`);
    return projectId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathForWrite);
  }
};

export const updateProject = async (projectId: string, name: string, identity: any, technical: any, brand: any, sections: any[], isDeleted: boolean = false) => {
  if (!auth.currentUser) throw new Error("Must be logged in to update a project");
  
  const time = Timestamp.now();
  const pathForWrite = `projects/${projectId}`;
  
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      name,
      identity,
      technical,
      brand,
      sections,
      isDeleted,
      updatedAt: time,
    });
    
    await logActivity(projectId, 'Updated project', `Updated project properties`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathForWrite);
  }
};

export const softDeleteProject = async (projectId: string) => {
  if (!auth.currentUser) throw new Error("Must be logged in");
  const pathForWrite = `projects/${projectId}`;
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      isDeleted: true,
      updatedAt: Timestamp.now(),
    });
    await logActivity(projectId, 'Moved to Trash', `Project moved to trash`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathForWrite);
  }
}

export const restoreProject = async (projectId: string) => {
  if (!auth.currentUser) throw new Error("Must be logged in");
  const pathForWrite = `projects/${projectId}`;
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      isDeleted: false,
      updatedAt: Timestamp.now(),
    });
    await logActivity(projectId, 'Restored from Trash', `Project restored from trash`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathForWrite);
  }
}

export const hardDeleteProject = async (projectId: string) => {
    if (!auth.currentUser) throw new Error("Must be logged in");
    const pathForWrite = `projects/${projectId}`;
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      // Delete associated activity logs
      const q = query(collection(db, 'activityLogs'), where('projectId', '==', projectId));
      const snapshot = await getDocs(q);
      snapshot.forEach(async (docSnap) => {
          await deleteDoc(doc(db, 'activityLogs', docSnap.id));
      });
    } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, pathForWrite);
    }
}

export const getActiveProjects = async () => {
  if (!auth.currentUser) return [];
  const q = query(collection(db, 'projects'), where('userId', '==', auth.currentUser.uid), where('isDeleted', '==', false));
  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectData)).sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'projects');
  }
};

export const getTrashProjects = async () => {
  if (!auth.currentUser) return [];
  const q = query(collection(db, 'projects'), where('userId', '==', auth.currentUser.uid), where('isDeleted', '==', true));
  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectData)).sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'projects');
  }
};

export const getProject = async (projectId: string) => {
  const pathForGet = `projects/${projectId}`;
  try {
    const docSnap = await getDoc(doc(db, 'projects', projectId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ProjectData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, pathForGet);
  }
}

export const logActivity = async (projectId: string, action: string, details: string) => {
  if (!auth.currentUser) return;
  const logId = crypto.randomUUID();
  const time = Timestamp.now();
  const pathForWrite = `activityLogs/${logId}`;
  
  try {
    await setDoc(doc(db, 'activityLogs', logId), {
      userId: auth.currentUser.uid,
      projectId,
      action,
      details,
      timestamp: time,
    });
  } catch (error) {
    // Only log silently to prevent blowing up the app if logging fails
    console.warn("Failed to log activity", error);
  }
};

export const getActivityLogs = async (projectId: string) => {
  if (!auth.currentUser) return [];
  const q = query(collection(db, 'activityLogs'), where('projectId', '==', projectId));
  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog)).sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'activityLogs');
  }
};
