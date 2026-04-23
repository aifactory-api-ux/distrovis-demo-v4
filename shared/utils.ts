export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDateISO(date: Date): string {
    return date.toISOString().split("T")[0];
}
