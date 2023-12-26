import axios from "axios";
let isConnected = false; // track the connection

export const connectToDB = async () => {
    try {
        // Authenticate
        if(isConnected) {
            console.log('Odoo is already connected');
            return;
        }

        const authResponse = await axios.post('http://localhost:8016/jsonrpc', {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: 'common',
                method: 'authenticate',
                args: ['hg', 'hg', 'hg', {}],
            },
        });

        isConnected = authResponse.data.result ? true : false

    } catch (error) {
        console.log('Error', error)
    }
};
