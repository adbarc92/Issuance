import React, { useEffect } from 'react';

import { createConnection, Timestamp } from 'typeorm';

import {
  TicketPriority,
  TicketType,
  TicketStatus,
  Ticket,
} from 'entity/Ticket';

// Example Index Code
// createConnection()
//   .then(async connection => {
//     console.log('Inserting a new user into the database...');
//     const user = new User();
//     user.firstName = 'Timber';
//     user.lastName = 'Saw';
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log('Saved a new user with id: ' + user.id);

//     console.log('Loading users from the database...');
//     const users = await connection.manager.find(User);
//     console.log('Loaded users: ', users);

//     console.log('Here you can setup and run express/koa/any other framework.');
//   })
//   .catch(error => console.log(error));

const createNewTicket = (
  id: number,
  name: string,
  summary: string,
  description: string,
  priority: TicketPriority,
  deadline: Timestamp,
  type: TicketType,
  reportedBy: number,
  completedBy: number,
  assignedTo: number,
  createdOn: Timestamp,
  status: TicketStatus
) => {
  const ticket = new Ticket();
  ticket.id = id;
  ticket.name = name;
  ticket.summary = summary;
  ticket.description = description;
  ticket.priority = priority;
  ticket.deadline = deadline;
  ticket.type = type;
  ticket.reportedBy = reportedBy;
  ticket.completedBy = completedBy;
  ticket.assignedTo = assignedTo;
  ticket.createdOn = createdOn;
  ticket.status = status;
  return ticket;
};

const App = (): JSX.Element => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    createConnection().then(async connection => {
      // const ticket = createNewTicket();
      // await connection.manager.save(ticket);
    });
  });

  return <div>This is not the next Jira</div>;
};

export default App;
