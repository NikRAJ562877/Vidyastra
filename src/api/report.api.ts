import axiosInstance from './axios';

export const uploadReport = async (file: File) => {
    const formData = new FormData();
    formData.append('report', file);
    const response = await axiosInstance.post('/reports/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getReports = async () => {
    const response = await axiosInstance.get('/reports');
    return response.data;
};
