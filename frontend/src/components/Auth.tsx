import { SignupSchema } from "@amartyasharma/medium-common"
import axios from "axios"
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"


export const Auth = ({type}: {type: "signup" | "signin"}) => {
    const navigate = useNavigate()
    const [postInput, setPostInputs] = useState<SignupSchema>({
        name: "",
        email: "",
        password: ""
    })

    async function sendRequest() {
        try{
            const resp = await axios.post(`${BACKEND_URL}/user/${type == 'signin' ? 'signin' : 'signup'}`, postInput)
            const jwt = resp.data
            console.log(resp.data)

            localStorage.setItem('token', String(jwt))
            navigate('/blogs')
        }
        catch(e){
            alert(`Error while signing ${type == 'signin' ? 'in' : 'up'}`)
        }
    }

    return <>
        <div className="h-screen flex justify-center flex-col" >
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">
                            {type == "signup" ? "Create an Account" : "Login to Account"}
                        </div>
                        <div className="text-slate-400">
                            {type == "signup" ? "Already have an account?" : "Create an account?"}
                            <Link className="pl-2 underline" to={type == "signin" ? "/signup" : "/signin"}>Login</Link>
                        </div>
                    </div>
                    <div>
                        {type === "signup" ? (
                            <LabelledInput label="Name" placeholder="John Doe" onChange={(e) => {
                                setPostInputs({
                                    ...postInput,
                                    name: e.target.value
                                })
                            }} />
                        ): null}
                        <LabelledInput label="Email" placeholder="johndoe@xyz.com" onChange={(e) => {
                            setPostInputs({
                                ...postInput,
                                email: e.target.value
                            })
                        }} />
                        <LabelledInput label="Password" type="password" placeholder="********" onChange={(e) => {
                            setPostInputs({
                                ...postInput,
                                password: e.target.value
                            })
                        }} />
                        <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>                    </div>
                </div>
            </div>
        </div>
    </>
}

interface LabelledInputType {
    label: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: string
}

function LabelledInput({label, placeholder, onChange, type}: LabelledInputType){
    return <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-black-700 dark:text-green-500 pt-4">{label}</label>
        <input onChange={onChange} type={ type || "text"} id="success" className="bg-white-50 border border-black-500 text-black-900 dark:text-black-400 placeholder-black-700 dark:placeholder-black-500 text-sm rounded-lg focus:ring-green-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder={placeholder} required />
  </div>
}