"use client";

import { AxiosError } from "axios";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Yup from "yup";
import { useToast } from "@/app/hooks/useToast";
import { ImSpinner3 } from "react-icons/im";
import { useEffect } from "react";
import apiClient from "@/api/axiosInstance";

export default function SignUp() {
  interface FormValues {
    name: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
  }


  const pathname = usePathname();
  const router = useRouter();

  useEffect(()=>{
    const user=localStorage.getItem("userId")
    if(!user && pathname !=="/login"){
      return router.push("/login") 
    }
  },[])

  const { showError } = useToast();

  const handleSubmit = async (
    values: FormValues,
    { resetForm,setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    console.log(values);

    try {
      const response = await apiClient.post(
        "/users/signup",
        values
      );

      console.log(response.data);

      if (response.status === 201) {
        router.push("/login");
        resetForm();
        console.log("usersData:", values);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 409) {
        showError("User is already exist");
      } else {
        showError("signup failed! Please try again");
      }
      console.error("signup failed:", error);
    }
    finally{
      setSubmitting(false)
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <Image
        src={"/thredsBg.png"}
        alt="threads-bg"
        width={1300}
        height={500}
        className="absolute -top-28"
      />

      <div className="flex flex-col items-center justify-center mt-44">
        <h1 className="text-2xl">threads</h1>
        <div>
          <Formik
            initialValues={{
              name: "",
              username: "",
              email: "",
              password: "",
              phoneNumber: "",
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Name is required"),
              username: Yup.string().required("Username is required"),
              email: Yup.string()
                .email("Invalid email format")
                .required("Email is required"),
              password: Yup.string()
                .min(7, "Password must be at least 6 characters")
                .matches(
                  /[^A-Za-z0-9]/,
                  "Password must contain at least one special character"
                )
                .required("Password is required"),
              phoneNumber: Yup.string()
                .matches(/^\d{10}$/, "Phone number must be 10 digits")
                .required("Phone is required"),
            })}
            onSubmit={handleSubmit}
          >
            {({isSubmitting})=>(
            <Form className="flex flex-col space-y-4 p-4">
              <div>
                <Field
                  className="bg-gray-100 w-96 h-12 p-4 rounded-lg outline-none border border-transparent focus:border-gray-300 focus:ring-0"
                  name="name"
                  type="text"
                  placeholder="Name"
                  // autoComplete="off"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  className="bg-gray-100 w-96 h-12 p-4 rounded-lg outline-none border border-transparent focus:border-gray-300 focus:ring-0 "
                  name="username"
                  type="text"
                  placeholder="Username"
                  // autoComplete="off"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  className="bg-gray-100 w-96 h-12 rounded-lg p-4 outline-none border border-transparent focus:border-gray-300 focus:ring-0"
                  name="email"
                  type="email"
                  placeholder="Email"
                  // autoComplete="off"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  className="bg-gray-100 w-96 h-12 rounded-lg p-4 outline-none border border-transparent focus:border-gray-300 focus:ring-0"
                  name="password"
                  type="password"
                  placeholder="Password"
                  // autoComplete="off"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  className="bg-gray-100 w-96 h-12 p-4 rounded-lg outline-none border border-transparent focus:border-gray-300 focus:ring-0"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone"
                  autoComplete="off"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* add loading disable while signup*/}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 bg-black w-96 text-white h-14 rounded-lg transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"
                }`}
              >
                {isSubmitting ? (
                <>
                  <ImSpinner3 className="animate-spin text-xl" /> Signing Up
                </>
              ) : (
                "Sign Up"
              )}
              </button>
              <p className="text-center text-gray-400">
                Already have an account?
                <Link href={"/login"}>Login</Link>{" "}
              </p>
            </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
