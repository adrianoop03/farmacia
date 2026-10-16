import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';

import { NavLink, useLocation } from 'react-router-dom';

const mainListItems = [
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: <HomeRoundedIcon />,
  },
  {
    text: 'Empleados',
    path: '/empleados',
    icon: <PeopleRoundedIcon />,
  },
  {
    text: 'Medicamentos',
    path: '/medicamentos',
    icon: <MedicationRoundedIcon />,
  },
  {
    text: 'Categorías',
    path: '/categorias',
    icon: <CategoryRoundedIcon />,
  },
];

export default function MenuContent({ onNavigate }) {
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1 }}>
      <List dense>
        {mainListItems.map((item) => (
          <ListItem
            key={item.path}
            disablePadding
            sx={{ display: 'block' }}
          >
            <ListItemButton
              component={NavLink}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={onNavigate}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}