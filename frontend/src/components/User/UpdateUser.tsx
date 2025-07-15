import './UpdateUser.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import {updateProfileThunk, deleteProfilethunk, getUserProfileThunk} from '../../redux/users';
import {IFullUser} from '../../redux/types/session'

const UpdateUser = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.session.user) as IFullUser | null;
    const [fieldToEdit, setFieldToEdit] = useState<string | null>(null);
    const [input, setInput] = useState<string>('');
    const [errors, setErrors] = useState<string| null>(null);
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

  const fields = [
    {label: 'Email', key: 'email'},
    {label: 'Username', key: 'username'},
    {label: 'First Name', key: 'firstName'},
    {label: 'Last Name', key: 'lastName'}
  ]

   const startEdit = (key: string) => {
       setFieldToEdit(key);
       setInput((user as any)[key] || '');
       setErrors(null);
   };

   const cancelEdit = () => {
       setFieldToEdit(null);
       setInput('');
       setErrors(null);
   };

   const saveEdit = async () => {
    setErrors(null);
    const updatedData = {[fieldToEdit as string]: input};



       const res = await dispatch(updateProfileThunk(updatedData));
       if (res.errors) {
           setErrors(res.errors);
       } else {
           setIsSuccessful(true);
           setErrors(null);
           if (user && user.id) {
               await dispatch(getUserProfileThunk(user.id));
           }
           setFieldToEdit(null);
           setInput('');
       }
   };

   const handleDelete = async () => {
       const res = await dispatch(deleteProfilethunk());
       if (res.errors) {
           setErrors(res.errors);
       } else {
           navigate('/');
       }
   };

   if(!user) {
       return <div>Loading...</div>;
   }

   return (
       <div className='update-container'>
        <h2>Edit Profile</h2>
        {fields.map(({label, key}) => (
            <div key={key} className='field-container'>
                <label>{label}:</label>
                {fieldToEdit === key ? (
                    <div className='edit-field'>
                        <input
                            type='text'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            />
                            <button type='button' onClick={saveEdit}>Save</button>
                            <button type='button' onClick={cancelEdit}>Cancel</button>
                            </div>
                ) : (
                    <div className='view-field'>
                        <span>{(user as any)[key]}</span>
                        <button type='button' onClick={() => startEdit(key)}>Edit</button>
                    </div>
                )}

       </div>
        ))}

        {isSuccessful && <div className="success">Profile updated successfully!</div>}
        <button type="button" className="delete-button" onClick={handleDelete}>Delete Profile</button>
       </div>
   );
}
export default UpdateUser;