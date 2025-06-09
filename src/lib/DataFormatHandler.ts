class DataFormatHandler {
    FormatName(name: string) {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 0) return '';

        const firstName = parts[0];
        const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

        return lastName ? `${firstName} ${lastName}` : firstName;
    }
    FormatDate(dateString: string | null) {
        if (dateString === null) return '';

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