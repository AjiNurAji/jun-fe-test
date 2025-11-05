"use client";

import { getIdToken, signOut, User, onAuthStateChanged } from "firebase/auth";
import React from "react";
import { firebaseAuth } from "~/libs/firebase/firebase";

interface AuthContextType {
	user: User | null;
	logout: () => Promise<void>;
	getToken: () => Promise<string | null>;
}

const AuthContext = React.createContext<AuthContextType>({
	user: null,
	logout: async () => {},
	getToken: async () => null,
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
	const [user, setUser] = React.useState<User | null>(null);
	const [loading, setLoading] = React.useState<boolean>(true);

	// React.useEffect(() => {
	// 	const unSubscribe = onAuthStateChanged((user) => {
	// 		setUser(user);
	// 		setLoading(false);
	// 	},{}, (error) => console.log(error));

	// 	// Cleanup subscription on unmount
	// 	return () => unSubscribe();
	// }, []);

	const logout = async () => {
		await signOut(firebaseAuth);
		setUser(null);
	};

	const getToken = async (): Promise<string | null> => {
		if (!firebaseAuth.currentUser) return null;

		return await getIdToken(firebaseAuth.currentUser!, true);
	};

	return (
		<AuthContext.Provider value={{ user, logout, getToken }}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
