import React, { useState, useEffect } from "react";
import { RootState } from "../store/configureStore";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { database } from "../firebase/firebase";
require("moment/locale/cs");

export const DeletionModal = (props: any) => {
  const { t } = useTranslation();

  const [uid, setUID] = useState("");
  const authenticationInfo = useSelector(
    (state: RootState) => state.authsReducer
  );

  useEffect(() => {
    setUID(authenticationInfo.uid);
  }, []);

  // const dispatch = useDispatch();
  const history = useHistory();

  const onDeleteClick = () => {
    // dispatch(removeTransaction(props.match.params.id));
    database.collection(uid).doc(props.id).delete();
    history.push("/dashboard");
  };

  const getTransactionToEdit = (e: any, id: any) => {
    e.preventDefault();
    history.push("/edit_transaction/" + id);
  };

  return (
    <div className="modal-box">
      <div className="deletion-modal-box">
        <p>{t("modal.warningSentence")}</p>
        <div className="modal-box-buttons">
          <Button
            variant="success"
            onClick={(e) => {
              getTransactionToEdit(e, props.id);
            }}
          >
            {t("modal.back")}
          </Button>
          <Button variant="danger" onClick={onDeleteClick}>
            {t("modal.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
};
