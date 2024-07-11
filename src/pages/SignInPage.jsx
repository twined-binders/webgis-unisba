import React, { useState } from "react";
import { Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader, CardFooter } from "@nextui-org/react";
import { Logo } from "../components/brand/Logo";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../configs/firebase-config";
import db from "../configs/firebase-config";

export default function SignInPage() {
  const [selected, setSelected] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const signUpUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setError("");
      // Create a Firestore document for the new user
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        approved: false,
        role: "user",
      });
      console.log("User signed up and Firestore document created");
    } catch (error) {
      setError(error.message);
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setError("");
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const onSignUp = async (e) => {
    e.preventDefault();
    await signUpUser(email, password);
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen justify-center">
      <div className="flex flex-col w-full items-center">
        <Card className="max-w-full w-1/3 h-[480px] p-4 flex">
          <CardHeader className="justify-center">
            <Logo />
            <p className="font-semibold text-xl">GeoUnisba</p>
          </CardHeader>
          <CardBody className="overflow-hidden">
            <Tabs fullWidth size="md" aria-label="Tabs form" selectedKey={selected} onSelectionChange={setSelected}>
              <Tab key="login" title="Login">
                <form className="flex flex-col gap-4" onSubmit={onLogin}>
                  <Input isRequired label="Email" placeholder="Enter your email" type="email" onChange={(e) => setEmail(e.target.value)} />
                  <Input isRequired label="Password" placeholder="Enter your password" type="password" onChange={(e) => setPassword(e.target.value)} />
                  <p className="text-center text-small">
                    Need to create an account?{" "}
                    <Link size="sm" onPress={() => setSelected("sign-up")}>
                      Sign up
                    </Link>
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button fullWidth color="primary" type="submit">
                      Login
                    </Button>
                  </div>
                </form>
              </Tab>
              <Tab key="sign-up" title="Sign up">
                <form className="flex flex-col gap-4 h-[300px]" onSubmit={onSignUp}>
                  <Input isRequired label="Email" placeholder="Enter your email" type="email" onChange={(e) => setEmail(e.target.value)} />
                  <Input isRequired label="Password" placeholder="Enter your password" type="password" onChange={(e) => setPassword(e.target.value)} />
                  <p className="text-center text-small">
                    Already have an account?{" "}
                    <Link size="sm" onPress={() => setSelected("login")}>
                      Login
                    </Link>
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button fullWidth color="primary" type="submit">
                      Sign up
                    </Button>
                  </div>
                </form>
              </Tab>
            </Tabs>
          </CardBody>
          <CardFooter>{error && <p className="w-full text-center rounded border border-pink-100 bg-pink-50 px-4 text-sm text-pink-500">{error}</p>}</CardFooter>
        </Card>
      </div>
    </div>
  );
}
