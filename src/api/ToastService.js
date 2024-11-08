import { toast } from "react-toastify";

const toastConfig = {
    position: "top-right",
    autoClose: 500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
};
export function toastSuccess(message) { toast.info(message, toastConfig); }
export function toastInfo(message) { toast.info(message, toastConfig); }
export function toastWarning(message) { toast.info(message, toastConfig); }
export function toastError(message) { toast.info(message, toastConfig); }


