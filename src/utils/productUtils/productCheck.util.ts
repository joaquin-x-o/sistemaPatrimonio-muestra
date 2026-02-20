export function shouldBeChecked(lastCheckDate: Date | null): boolean {
    
    // si no hay fecha asignada aún, entonces se debe revisarlo
    if (!lastCheckDate) { 
        return true 
    };

    const SIX_MONTHS_IN_MS = 1000 * 60 * 60 * 24 * 30 * 6;
    const now = new Date().getTime();
    const lastCheck = new Date(lastCheckDate).getTime();

    const result = now - lastCheck >= SIX_MONTHS_IN_MS;

    return result;
}
