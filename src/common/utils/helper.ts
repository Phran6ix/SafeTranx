export const Paginate = (page: number, limit: number = 10): { offset: number, limit: number } => {
	return { offset: (page * limit) - limit, limit }
}
