// const { user, loading: authLoading } = useAuth();

//   const [proposals, setProposals] = useState<Proposal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProposals = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const data = await getProposals();
//         if (data) {
//           setProposals(data);
//         } else {
//           setError('Failed to fetch proposals.');
//           toast.error('Could not load proposals.');
//         }
//       } catch (err) {
//         setError('An error occurred while fetching data.');
//         toast.error('Failed to load proposals.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (!authLoading && user) {
//       fetchProposals();
//     } else if (!authLoading && !user) {
//       setIsLoading(false);
//       setError('You must be logged in to view proposals.');
//     }
//   }, [user, authLoading]);
