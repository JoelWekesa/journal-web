
import axios from 'axios';

const ApiClient = ({ token }: { token: string }) => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const defaultOptions = {
        baseURL,
        timeout: 5000,
    };

    const instance = axios.create(defaultOptions);

    instance.interceptors.request.use(async (request) => {
        // const sessionId = await getServerSession(options);

        request.headers.Authorization = `Bearer ${token}`;

        return request;
    });

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {

            console.log(error)

        }
    );

    return instance;
};

export default ApiClient;
