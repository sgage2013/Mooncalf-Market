import { deleteProfileThunk } from "../../redux/users";
import {useAppDispatch} from "../../redux/store";
import {useModal} from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import './DeleteUserModal.css';

interface DeleteUserModalProps {

  onSuccess: () => void;
}

function DeleteUserModal ({onSuccess }: DeleteUserModalProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    const result = await dispatch(deleteProfileThunk());
    if (result) {
        closeModal();
      onSuccess();
    }
    navigate('/');
  };

  return (
    <div className="delete-user-modal">
      <p>Are you sure you want to delete this user?</p>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
};

export default DeleteUserModal;
