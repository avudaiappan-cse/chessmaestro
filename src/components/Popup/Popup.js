import React from "react";
import { useAppContext } from "../../context/Context";
import { closePopup } from "../../reducer/actions/popup";
import { STATUSES } from "../../utils/constant";
import "./Popup.css";

const Popup = ({ children }) => {
    const { appState, dispatch } = useAppContext();

    const onClosePopup = () => {
        dispatch(closePopup());
    }

    return appState.status === STATUSES.ongoing ? null : (
        <div className="popup">
            {React.Children.toArray(children).map(child => React.cloneElement(child, { onClosePopup }))}
        </div>
    );
}

export default Popup;