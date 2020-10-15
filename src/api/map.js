import axios from 'axios';
 
export const autoComplete = axios.create({
   baseURL: 'https://api.yelp.com/v3/businesses',
   headers: {
       Authorization: 'Bearer BUhQtq6Jbr9EVyDcNQTkJ79IoWZtb_S8zWX9wu1edWVkOcwcAzbTxWeynzfKMlhkXMghFl38SUvdX7pdbIrKHX3fB_k16NEY9WQRukuyX6fpuI7IHUM-Wqoiy5v3XnYx'
   }
});



// const [term, setTerm] = useState('');
// const [results, setResults] = useState([]);
// const [errorMessage, setErrorMessage] = useState('');


// const searchApi = async () => {
//     try {
//         const response = await yelp.get('/search', {
//             params: {
//                 limit: 50,
//                 term: term,
//                 location: 'san jose'
//             }
//         });
//         setResults(response.data.businesses)

//     } catch (err) {
//         setErrorMessage('something went wrong!')
//     }
// }
