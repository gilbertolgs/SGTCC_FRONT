import Cookie from "$model/Cookie";
import LoggedUser from "$model/LoggedUser";
import UsuarioRepository from "$repository/UsuarioRepository";
import { storeLogin } from "../stores";


class CalendarHandler {
    getMonthName(mes: Date): string {
        const mesLongo = mes.toLocaleString('default', { month: 'long' });

        return mesLongo.charAt(0).toUpperCase() + mesLongo.slice(1);
    }
    private daysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }
    getCalendarGrid(current: Date): Array<{ date: Date; isCurrentMonth: boolean }> {
        const year = current.getFullYear();
        const month = current.getMonth();
        const startDay = new Date(year, month, 1).getDay();
        const currentMonthDays = this.daysInMonth(year, month);
        const prevMonthDays = this.daysInMonth(year, month - 1);
        const totalCells = 35;

        const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

        for (let i = startDay - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthDays - i);
            days.push({ date, isCurrentMonth: false });
        }

        for (let i = 1; i <= currentMonthDays; i++) {
            const date = new Date(year, month, i);
            days.push({ date, isCurrentMonth: true });
        }

        const remaining = totalCells - days.length;
        for (let i = 1; i <= remaining; i++) {
            const date = new Date(year, month + 1, i);
            days.push({ date, isCurrentMonth: false });
        }

        return days;
    }
}

export default new CalendarHandler();