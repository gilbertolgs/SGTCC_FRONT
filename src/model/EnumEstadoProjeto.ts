enum Estado {
    Aluno = 1,
    Professor = 2,
    Admin = 3
}

function PegarEstadoProjeto(estado: Estado): string {
    switch (estado) {
        case Estado.Aluno:
            return 'Aluno';
        case Estado.Professor:
            return 'Professor';
        case Estado.Admin:
            return 'Administrador';
        default:
            return 'Sem Papel';
    }
}

export default PegarEstadoProjeto;