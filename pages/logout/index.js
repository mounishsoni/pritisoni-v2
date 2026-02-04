import Router, { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUtils } from "../../utils/logout";
import dynamic from "next/dynamic";
import { setUserData } from "../../features/slice/initialStatesSlice";

const logout = dynamic(
  () => {
    const dispatch = useDispatch();

    dispatch(
      setUserData({
        name: "",
        id: "",
        email: "",
        role: "",
      }),
    );

    localStorage.clear();
    Router.push("/");
  },
  { ssr: false },
);
export default logout;
