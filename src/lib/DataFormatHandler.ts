class DataFormatHandler {
    FormatDate(dateString: string) {
        const newDate = new Date(dateString);

        const formatted = newDate.toLocaleDateString();
        // const formatted = newDate.toLocaleString();
        return formatted;
    }
}
export default new DataFormatHandler();