import { useEffect, useState } from 'react';
import { userApi } from '../services/api';
import { Expert } from '../types/Expert';

export const useCurrentUser = () => {
    const [user, setUser] = useState<Expert | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        userApi.getCurrentUser()
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.error('Ошибка получения пользователя', err);
                setError(err?.response?.data?.message || 'Ошибка при загрузке пользователя');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { user, loading, error };
};
