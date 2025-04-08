class DataFormatHandler {
    FormatDate(dateString: string) {
        const newDate = new Date(dateString);

        const formatted = newDate.toLocaleDateString();
        // const formatted = newDate.toLocaleString();
        return formatted;
    }

    FormatBytes(bytes: number, decimals: number = 2): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }

}
export default new DataFormatHandler();