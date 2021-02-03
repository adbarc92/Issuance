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

import { Person } from 'types/person';

import { FormAction } from 'hooks/form';

import { ProjectDialogAction } from 'components/ProjectDialog';

const SpacedButton = styled(Button)(() => {
  return {
    margin: theme.spacing(0.5),
  };
});

const OverflowPaper = styled(Paper)(() => {
  return {
    width: 200,
    height: 230,
    overflow: 'auto',
  };
});

const PaperTitle = styled('div')(() => {
  return {
    textAlign: 'center',
    fontSize: '1rem',
  };
});

const ListContainer = styled('div')(() => {
  return {
    margin: '1rem',
  };
});

interface TransferListProps {
  inputList: Person[];
  setPersonnel: (people: Person[]) => void;
}

const getIntersect = (a: Person[], b: Person[]) => {
  return a.filter(value => b.indexOf(value) !== -1);
};

const getDisjoint = (a: Person[], b: Person[]) => {
  return a.filter(value => b.indexOf(value) === -1);
};

// const getUnion = (a: Person[], b: Person[]) => {
//   return [...a, ...getDisjoint(b, a)];
// };

const TransferList = (props: TransferListProps): JSX.Element => {
  const { setPersonnel } = props;

  console.log('transferProps:', props);

  const [checked, setChecked] = React.useState<Person[]>([]);

  const [left, setLeft] = React.useState<Person[]>(props.inputList);
  const [right, setRight] = React.useState<Person[]>([]);

  const leftChecked = getIntersect(checked, left);
  const rightChecked = getIntersect(checked, right);

  const handleToggle = (value: Person) => {
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
    // dispatch({
    //   type: ProjectDialogAction.SET_AVAILABLE_PERSONNEL,
    //   payload: left.concat(right),
    // });
    setRight([]);
    setPersonnel([]);
    // dispatch({
    //   type: ProjectDialogAction.SET_ASSIGNED_PERSONNEL,
    //   payload: [],
    // });
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setPersonnel(right.concat(left));
    // dispatch({
    //   type: ProjectDialogAction.SET_ASSIGNED_PERSONNEL,
    //   payload: right.concat(left),
    // });
    setLeft([]);
    // dispatch({
    //   type: ProjectDialogAction.SET_AVAILABLE_PERSONNEL,
    //   payload: [],
    // });
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(getDisjoint(right, rightChecked));
    setPersonnel(getDisjoint(right, rightChecked));
    setChecked(getDisjoint(checked, rightChecked));
  };
  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setPersonnel(right.concat(leftChecked));
    setLeft(getDisjoint(left, leftChecked));
    setChecked(getDisjoint(checked, leftChecked));
  };

  const List = (items: Person[], title: string) => (
    <ListContainer>
      <PaperTitle>{title}</PaperTitle>
      <OverflowPaper>
        <MuiList>
          {items.map((person: Person, index: number) => {
            const labelId = `transfer-list-item-${index}-label`;

            return (
              <ListItem
                key={index}
                role="listitem"
                button
                onClick={() => handleToggle(person)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(person) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={person.userEmail} />
              </ListItem>
            );
          })}
        </MuiList>
      </OverflowPaper>
    </ListContainer>
  );

  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      <Grid item>{List(left, 'Available Personnel')}</Grid>
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
      <Grid item>{List(right, 'Assigned Personnel')}</Grid>
    </Grid>
  );
};

export default TransferList;
