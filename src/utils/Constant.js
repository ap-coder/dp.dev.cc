export const CACHE_USER_KEY = 'TIQ_USER_TOKEN';
export const CACHE_USER_PERMISSION = 'TIQ_USER_PERMISSION';
export const CACHE_PLATFORM = 'TIQ_PLATFORM';
export const CACHE_USER_INFO = 'TIQ_USER_INFO';

// http://localhost:3000/
// http://159.65.133.206:3333/
// export const API_URL = 'http://159.65.133.206:3333/';
// export const API_URL = 'https://tiq.haorich.tw/';
// export const API_URL = 'http://localhost:3000/';
// export const API_URL = 'http://localhost:3334/';
export const API_URL = 'http://ec2-3-21-125-174.us-east-2.compute.amazonaws.com:3334/';

export const ROLE_ID = {
    LEGAL_ROLE_ID: '6D9E58A2-36CC-48C7-A3B5-7DDCED2025B9',
    PRODUCT_ROLE_ID: '7F6BA760-513B-42B0-8C6D-43B3F4091322',
    ADMIN_ROLE_ID: '8FF0635B-B7B1-4518-8BBB-3C3E33844BE9',
    SALES_ROLE_ID: '944E4B4C-77EB-4CE7-B083-3DFFC5321EF7',
    OPERATIONS_ROLE_ID: 'AFDD2928-4005-4FBE-A4C9-BED34F8A9A38',
    CUSTOMER_ROLE_ID: 'D6219FCE-F665-4A85-9ED3-D2296159DF20',
    SUPPORT_ROLE_ID: 'EFAC50F4-6928-440E-A995-F02FFD6A5EA5'
}

export const FILE_TYPE = [
    { key: 0, text: 'CortexDecoder SDK for Android' },
    { key: 1, text: 'CortexDecoder SDK for iOS' },
    { key: 2, text: 'EdgeDecoder SDK for Windows' },
    { key: 3, text: 'EdgeDecoder SDK for Linux' },
    { key: 4, text: 'CortexDecoder SDK for Xamarin' },
    { key: 5, text: 'CortexDecoder SDK for Web' },
]

export const SDK_TYPE = [
    { key: -1, text: 'Select Type' },
    { key: 0 , text: 'EDK Library' },
    { key: 1 , text: 'Embedded Library' },
    { key: 2 , text: 'EDK License Key' },
    { key: 3, text: 'Gemalto License Key' },
    { key: 4 , text: 'Soraco License Key' },
    { key: 6 , text: 'Sample project' },
    { key: 7 , text: 'Document' },
    { key: 8 , text: 'SDK Library' },
]

export const DELIVERY_FILE_TYPE = [
    { key: -1 , text: 'Other File' },
    { key: 0 , text: 'EDK Library' },
    { key: 1 , text: 'Embedded Library' },
    { key: 2 , text: 'EDK License Key' },
    { key: 3, text: 'Gemalto License Key' },
    { key: 4 , text: 'Soraco License Key' },
    // { key: 5 , text: 'Cryptolens License Key' },
    { key: 6 , text: 'Sample project' },
    { key: 7 , text: 'Document' },
    { key: 8 , text: 'SDK Library' },
    { key: 9 , text: 'Other File' },
    { key: 10 , text: 'Contract' },
]

export const USER_STATUS = [
    { key: '', text: 'Select Status'},
    { key: 0, text: 'Registered', class: 'txtRed'},
    { key: 1, text: 'Pending', class: 'txtGray'},
    { key: 2, text: 'Approved', class: 'txtBlue'},
    { key: -1, text: 'Disabled'}
]

export const VISIBILITY_TYPE = [
    { key: 0, text: 'Hidden'},
    { key: 1, text: 'Public'},
    { key: 2, text: 'Protected'},
]
