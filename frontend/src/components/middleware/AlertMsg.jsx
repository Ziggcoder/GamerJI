import { Store } from "react-notifications-component";


export const ErrorAlert = async (data) => {
  Store.addNotification({
    title:data.title,
    message:data.message,
    type: "danger",
    insert: "top",
    container: "top-right",
    dismiss: {
      duration: 1000,
    },
  });
}

export const SuccessAlert = async (data) => {
  Store.addNotification({
    title:data.title,
    message:data.message,
    type: "success",
    insert: "top",
    container: "top-right",
    dismiss: {
      duration: 1000,
    },
  });
}

