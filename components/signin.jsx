import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import Image from "next/image";
import LoginWithSocial from "./loginWithSocial";
import { Divider } from "primereact/divider";
import { useDispatch } from "react-redux";
import { supabase } from "../config/supabaseClient";
import { setUserData } from "../features/slice/initialStatesSlice";
import { Toast } from "primereact/toast";
import Router from "next/router";

export default function Signin() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // const dispatch = useDispatch();
  // const toast = useRef(null);

  // const signInWithEmailAndPassword = async (email, password, dispatch) => {
  //   if (!email || !password) {
  //     toast.current.show({
  //       severity: "warn",
  //       summary: "Error",
  //       detail: "Please enter your email address and password then try again!",
  //       life: 5000,
  //     });

  //     return;
  //   }
  //   try {
  //     const userCredential = await auth.signInWithEmailAndPassword(email, password);
  //     const user = userCredential.user;
  //     // localStorage.setItem("userId", userId);
  //     const fetchUser = await supabase.from("users").select().ilike("user_id", user.uid);
  //     let userData = {};
  //     userData = fetchUser.data[0];

  //     dispatch(
  //       setUserData({
  //         name: userData.name,
  //         id: userData.user_id,
  //         email: userData.email,
  //         role: userData.role,
  //       }),
  //     );

  //     if (!userData) {
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Error",
  //         detail: "Your email address and password doesn't match, please try again or reset password!",
  //         life: 5000,
  //       });
  //     } else {
  //       setTimeout(() => {
  //         Router.push("/open-orders");
  //       }, 1000);

  //       toast.current.show({
  //         severity: "success",
  //         summary: "Success",
  //         detail: "Successfully logged in. \nWelcome " + userData.name,
  //         life: 5000,
  //       });
  //     }
  //   } catch (err) {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Error",
  //       detail: "Please check your email address and password then try again!",
  //       life: 5000,
  //     });
  //   }
  // };

  // const resetPassword = async (email) => {
  //   if (email) {
  //     try {
  //       await auth.sendPasswordResetEmail(email);

  //       toast.current.show({
  //         severity: "success",
  //         summary: "Success",
  //         detail: "Password reset link has been sent to your email address. Please check your inbox!",
  //         sticky: true,
  //       });
  //     } catch (err) {
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Error",
  //         detail: "Error on reset password request, Please try after some time or contact tech support!",
  //         sticky: true,
  //       });
  //     }
  //   } else {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Error",
  //       detail: "Please fill your email address mention in form before click Forgot Password button",
  //       life: 8000,
  //     });
  //   }
  // };

  return (
    <>
      {/* <Toast ref={toast} /> */}
      <div className="flex align-items-center justify-content-center img-background">
        <div className="surface-card p-5 shadow-8 border-round w-full lg:w-4 md:w-6 sm:w-8">
          <div className="text-center mb-5">
            {/* <Image aria-hidden src="./logo.svg" alt="Raftaar Logo" width={100} height={100} className="mb-3" /> */}
            <div className="text-white text-3xl font-semibold mb-3 w-full">Welcome to the Divine Portal</div>
          </div>

          {/* <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email Address
            </label>
            <InputText id="email" className="w-full mb-3" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label htmlFor="password" className="block text-white font-medium mb-2">
              Password
            </label>
            <InputText id="password" type="password" placeholder="Password" className="w-full mb-3" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <div className="flex align-items-center justify-content-between mb-6">
              <a
                className="font-medium underline ml-2 text-red-300 text-right cursor-pointer"
                onClick={() => {
                  resetPassword(email);
                }}
              >
                Forgot your password?
              </a>
            </div> */}

          {/* <Button
              label="Sign In"
              icon="pi pi-user"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                signInWithEmailAndPassword(email, password, dispatch);
              }}
            /> */}
          {/* <Divider /> */}
          <LoginWithSocial />
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
