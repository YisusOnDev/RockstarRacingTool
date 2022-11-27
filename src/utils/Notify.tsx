import { toast } from "react-toastify";

export default function Notify(message: string, type = 'default') {
    switch (type) {
        case 'success':
            toast(message, {
                type: 'success'
            })
            break;

        case 'info':
            toast(message, {
                type: 'info'
            })
            break;

        case 'error':
            toast(message, {
                type: 'error'
            })
            break;

        case 'warning':
            toast(message, {
                type: 'warning'
            })
            break;

        default:
            toast(message, {
                type: 'default'
            })
            break;
    }
}