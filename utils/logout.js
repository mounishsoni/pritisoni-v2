import { setUserData } from "../features/slice/initialStatesSlice";
const logoutUtils = (dispatch) => {
  dispatch(
    setUserData({
      name: "",
      id: "",
      email: "",
      role: "",
    }),
  );

  localStorage.clear();

  // useRouter().push("/")
};

export { logoutUtils };
