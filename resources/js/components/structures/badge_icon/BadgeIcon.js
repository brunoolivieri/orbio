import * as React from 'react';
import Badge from '@mui/material/Badge';
import MapIcon from '@mui/icons-material/Map';

export function BadgeIcon({...props}) {
  return (
    <Badge badgeContent={props.number} color={props.color}>
      <MapIcon color="action" />
    </Badge>
  );
}
