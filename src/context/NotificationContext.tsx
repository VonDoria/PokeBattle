import { createContext, ReactNode } from "react";
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type NotificationContextProviderProps = {
    children: ReactNode;
}

type NotificationContextType = {
    toastSuccess: (msg: string) => void;
    toastError: (msg: string) => void;
    toastInfo: (msg: string) => void;
    toastWarning: (msg: string) => void;
}

export const NotificationContext = createContext({} as NotificationContextType)

export function NotificationContextProvider(props: NotificationContextProviderProps){

    const toastConfig: ToastOptions = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        pauseOnFocusLoss: false
    }
    
    function toastSuccess(msg: string){
        toast.success(msg, toastConfig);
    }

    function toastError(msg: string){
        toast.error(msg, toastConfig);
    }

    function toastInfo(msg: string){
        toast.info(msg, toastConfig);
    }

    function toastWarning(msg: string){
        toast.warning(msg, toastConfig);
    }

    return (
        <NotificationContext.Provider value={{
            toastSuccess,
            toastError,
            toastInfo,
            toastWarning,
        }}>
            {props.children}
            <ToastContainer />
        </NotificationContext.Provider>
    );
}