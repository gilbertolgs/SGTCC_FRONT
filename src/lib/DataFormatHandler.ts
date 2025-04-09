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

        const value = bytes / Math.pow(k, i);

        const rounded = Number(value.toFixed(decimals));

        return `${rounded} ${sizes[i]}`;
    }

}
export default new DataFormatHandler();