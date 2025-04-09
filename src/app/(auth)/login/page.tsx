"use client";

import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/AuthSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/hooks/useToast";
import Link from "next/link";
import { ImSpinner3 } from "react-icons/im";
import apiClient from "@/api/axiosInstance";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showError } = useToast();

  interface FormValues {
    username: string;
    password: string;
  }

  const handleLogin = async (values: FormValues,
  ) => {
    console.log(values);

    const response = await apiClient.post(
      "/users/login",
      values
    );
    return response.data;
  };
  const loginMutation = useMutation({
    mutationFn: handleLogin,
    onSuccess: (data) => {
      console.log(data);
      dispatch(loginSuccess(data));
      localStorage.setItem("userId", data._id);
      router.replace("/");
    },
    onError: (error) => {
      showError("Enter Valid User & password");
      console.log("error ", error);
    },
  });

  return (
    <>
      <div className="flex items-center justify-center mt-44">
        <Image
          src="/thredsBg.png"
          alt="thread-backgorund"
          width={1300}
          height={10}
          priority
          className="absolute -top-28 left-1/2 -z-10 transform -translate-x-1/2"
        />
        <div>
          <h1 className="text-center text-sm">
            Log in with your Instagram account
          </h1>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={Yup.object({
              username: Yup.string()
                .min(3, "Min 3 letters required")
                .required("Username is required"),
              password: Yup.string()
                .min(7, "Password must be at least 6 characters")
                .required("Password is required"),
            })}
            onSubmit={(values) => {
              loginMutation.mutate({
                username: values.username,
                password: values.password,
              });
            }}
          >
            {({ handleSubmit }) => (
              <Form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-3 p-4 "
              >
                <div>
                  <Field
                    type="text"
                    name="username"
                    className="h-14 bg-gray-100 p-4 rounded-lg border border-transparent w-96 focus:border-gray-300 focus:ring-0 outline-none "
                    placeholder="Username"
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    className="h-14 bg-gray-100 p-4 rounded-lg outline-none border border-transparent focus:border-gray-300 focus:ring-0 w-96"
                    placeholder="Password"
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className={`flex items-center justify-center gap-2 bg-black w-96 text-white h-14 rounded-lg transition ${
                    loginMutation.isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"
                  }`}
                >
                  {loginMutation.isPending ? (
                    <>
                      <ImSpinner3 className="animate-spin text-xl" /> Logging
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                <button className="text-gray-500">Forgot password?</button>
                <p className="text-gray-500 text-center">---- or ----</p>
                <Link href={"https://www.instagram.com"}>
                  <button className="border border-gray-300 h-20 rounded-lg flex items-center w-96 justify-between">
                    <Image
                      className="ml-5"
                      src="/instagram-lgo.png"
                      alt="instagram logo"
                      width={50}
                      height={50}
                    />
                    continue with instagram
                    <MdOutlineKeyboardArrowRight className="text-2xl text-gray-400 mr-7" />
                  </button>
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
