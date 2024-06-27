import { FormEvent, useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const Auth = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      alert("success");
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log(auth?.currentUser?.email);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(auth?.currentUser?.email);

  return (
    <div className="space-y-8">
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="email..."
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Sign In</button>
      </form>

      <div className="flex items-center justify-center">
        <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      </div>

      <div className="flex items-center justify-center">
        <button onClick={handleLogOut}>Log Out</button>
      </div>
    </div>
  );
};
