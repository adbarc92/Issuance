import React from 'react';
import {
  Grid,
  List as MuiList,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Paper,
  styled,
} from '@material-ui/core';
import theme from 'theme';

const SpacedButton = styled(Button)(() => {
  return {
    margin: theme.spacing(0.5),
  };
});

interface TransferListProps<T> {
  leftList: T[];
  rightList?: T[];
}

const getIntersect = function <T>(a: T[], b: T[]) {
  return a.filter(value => b.indexOf(value) !== -1);
};

const getDisjoint = function <T>(a: T[], b: T[]) {
  return a.filter(value => b.indexOf(value) === -1);
};

const getUnion = function <T>(a: T[], b: T[]) {
  return [...a, ...getDisjoint(b, a)];
};

const TransferList = function <T>(props: TransferListProps<T>): JSX.Element {
  const [checked, setChecked] = React.useState<T[]>([]);
  const [left, setLeft] = React.useState<T[]>(props.leftList);
  const [right, setRight] = React.useState<T[]>(props.rightList ?? []);

  const leftChecked = getIntersect(checked, left);
  const rightChecked = getIntersect(checked, right);

  const handleToggle = (value: T) => {
    const index = checked.indexOf(value);
    const newChecked = [...checked];

    if (index === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(index, 1);
    }

    setChecked(newChecked);
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(getDisjoint(right, rightChecked));
    setChecked(getDisjoint(checked, rightChecked));
  };
  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(getDisjoint(left, leftChecked));
    setChecked(getDisjoint(checked, leftChecked));
  };

  const List = (items: T[]) => (
    <Paper>
      <MuiList>
        {items.map((item: T, index: number) => {
          const labelId = `transfer-list-item-${index}-label`;

          return (
            <ListItem
              key={index}
              role="listitem"
              button
              onClick={() => handleToggle(item)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(item) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={item} />
            </ListItem>
          );
        })}
      </MuiList>
    </Paper>
  );

  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      <Grid item>{List(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <SpacedButton
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </SpacedButton>
          <SpacedButton
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </SpacedButton>
          <SpacedButton
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </SpacedButton>
          <SpacedButton
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </SpacedButton>
        </Grid>
      </Grid>
      <Grid item>{List(right)}</Grid>
    </Grid>
  );
};

export default TransferList;
