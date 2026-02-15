import { db } from './firebase-config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface HabitData {
    [habitName: string]: {
        [dateString: string]: boolean;
    };
}

export const loadHabitProgress = async (uid: string): Promise<HabitData | null> => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data().habitData as HabitData;
        }
        return null;
    } catch (error) {
        console.error("Error loading habit progress:", error);
        return null;
    }
};

export const saveHabitProgress = async (uid: string, habitName: string, date: string, isChecked: boolean) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        // Use setDoc with merge: true to create the document if it doesn't exist, specific fields
        // path: habitData.HabitName.Date
        await setDoc(userDocRef, {
            habitData: {
                [habitName]: {
                    [date]: isChecked
                }
            }
        }, { merge: true });
    } catch (error) {
        console.error("Error saving habit progress:", error);
    }
};

export const saveHabitConfigs = async (uid: string, habits: any[]) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const configs = habits.reduce((acc, h, index) => {
            // Use ID as the key for robustness, fallback to name if no ID (legacy)
            const key = h.id || h.name;
            acc[key] = { goal: h.goal, unit: h.unit, id: h.id, name: h.name, order: index };
            return acc;
        }, {});

        // Try to update just the field to replace the map (avoids merging old keys)
        try {
            await updateDoc(userDocRef, { habitConfigs: configs });
        } catch (e) {
            // If doc doesn't exist, create it
            await setDoc(userDocRef, { habitConfigs: configs }, { merge: true });
        }
    } catch (error) {
        console.error("Error saving habit configs:", error);
    }
};

export const loadHabitConfigs = async (uid: string) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data().habitConfigs || {};
        }
        return {};
    } catch (error) {
        console.error("Error loading habit configs:", error);
        return {};
    }
};
