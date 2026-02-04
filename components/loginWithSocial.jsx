import firebase from "firebase/compat/app";
import { auth } from "../config/firebase";
import { setUserData } from "../features/slice/initialStatesSlice";
import { supabase } from "../config/supabaseClient";
// import Router from "next/router";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import Router from "next/router";

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const LoginWithSocial = () => {
  const dispatch = useDispatch();
  const toast = useRef(null);

  const signInWithGoogle = async (dispatch) => {
    try {
      const res = await auth.signInWithPopup(provider);
      const user = res.user;
      const fetchUser = await supabase.from("users").select().ilike("user_id", user.uid);
      let userData = {};
      if (fetchUser.data.length === 0) {
        userData = {
          user_id: user.uid,
          name: user.displayName,
          photo_url: user.photoURL,
          email: user.email,
          auth_provider: "google",
          role: "ADMIN",
        };
        await supabase.from("users").insert([userData]);
        // await supabase.from("users_dtl").insert([{ user_id: user.uid }]);
      } else {
        userData = fetchUser.data[0];
      }

      dispatch(
        setUserData({
          name: userData.name,
          id: userData.user_id,
          email: userData.email,
          role: userData.role,
          // TODO: set below states from user table
          // playlist: [],
          // currentIndex: null,
        }),
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Successfully logged in. \nWelcome " + user.displayName,
        sticky: true,
      });

      setTimeout(() => {
        Router.push("/dashboard");
      }, 1000);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error while logging with Google, Please try again after some time or contact tech support!",
        sticky: true,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} appendTo={null} />
      <Button
        label="Log In via Gmail"
        size="large"
        icon="pi pi-google"
        className="w-full text-2xl"
        severity="danger"
        raised
        onClick={(e) => {
          e.preventDefault();
          signInWithGoogle(dispatch);
        }}
      />
    </>
  );
};

export default LoginWithSocial;
