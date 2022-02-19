// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import { Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Paper } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#101F33",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

export function OrdersTable(){

    return(
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align="center">Nome da ordem</StyledTableCell>
                        <StyledTableCell align="center">Criação</StyledTableCell>
                        <StyledTableCell align="center">Inicialização</StyledTableCell>
                        <StyledTableCell align="center">Finalização</StyledTableCell>
                        <StyledTableCell align="center">Última atualização</StyledTableCell>
                        <StyledTableCell align="center">Situação</StyledTableCell>
                        <StyledTableCell align="center">Observações</StyledTableCell>
                        <StyledTableCell align="center">Planos</StyledTableCell>
                        <StyledTableCell align="center">Criador</StyledTableCell>
                        <StyledTableCell align="center">Piloto</StyledTableCell>
                        <StyledTableCell align="center">Cliente</StyledTableCell>
                        <StyledTableCell align="center">Editar</StyledTableCell>
                        <StyledTableCell align="center">Excluir</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody className = "tbody">


                    
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}