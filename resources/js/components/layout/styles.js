import { makeStyles } from '@mui/styles';

export const useMenuStyles = makeStyles(() => ({
    drawer: {
        "& .MuiDrawer-paper": { borderWidth: 1, borderTop: 0 },
        zIndex: 1
    },
    listItem: {
        display: 'block',
    },
    listItemButton: {
        minHeight: 48,
        justifyContent: ({ open }) => (open ? 'initial' : 'center'),
        padding: '0 20px'
    },
    listItemIcon: {
        minWidth: 0,
        marginRight: ({ open }) => (open ? '24px' : 'auto'),
        justifyContent: 'center',
        color: '#037B3A',
    },
    listItemText: {
        opacity: ({ open }) => (open ? 1 : 0),
        color: '#000',
    }
}));



