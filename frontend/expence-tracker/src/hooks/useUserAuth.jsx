import { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
    const {user, updateUser, clearUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) return

        let isMount = true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                if(isMount && response.data){
                    updateUser(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch user info: ", err);
                if(isMount){
                    clearUser();
                    navigate("/login")
                }
            }
        }

        fetchUserInfo();

        return
        
    }, [updateUser, clearUser, navigate]);
}