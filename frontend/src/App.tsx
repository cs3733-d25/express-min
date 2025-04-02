import { Suspense, use, useState } from "react";
import "./App.css";
import { Employee } from "./employee";
import CreateEmployeeForm from "./CreateEmployeeForm";

// You can't create a promise you are going to use during render,
// so create it up here
async function fetchEmployees(): Promise<Omit<Employee, "title">[]> {
  return await (await fetch("/api/employees")).json();
}
const fetchEmployeesPromise = fetchEmployees();

async function fetchEmployee(id: number): Promise<Employee> {
  // Delay so that you can see the loading take affect
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (await fetch(`/api/employees/${id}`)).json();
}

// Show the employee title, since that needs another request
function LazyLoadedTitle({
  employeeDetailsPromise,
}: {
  employeeDetailsPromise: Promise<Employee>;
}) {
  const employee = use(employeeDetailsPromise);
  return employee.title;
}

function App() {
  const serverEmployees = use(fetchEmployeesPromise);
  const [clientEmployees, setClientEmployees] = useState(serverEmployees);

  return (
    <>
      <CreateEmployeeForm
        handleAddEmployee={async (newEmployee) => {
          // Nifty trick to add the new employee to the table ASAP
          const oldClientEmployees = clientEmployees;

          // Add them temporarily
          setClientEmployees([
            ...clientEmployees,
            {
              ...newEmployee,
              id: NaN,
            },
          ]);

          // Make a request to add them for real and get ID
          const serverNewEmployee = await (
            await fetch("/api/employees", {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newEmployee),
            })
          ).json();

          // Set the client employees to be the server one
          setClientEmployees([...oldClientEmployees, serverNewEmployee]);
        }}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {clientEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{!isNaN(employee.id) ? employee.id : "Loading..."}</td>
              <td>{`${employee.firstName} ${employee.middleName ?? ""} ${employee.lastName}`}</td>
              <td>
                {!isNaN(employee.id) ? (
                  <Suspense fallback="Loading...">
                    {/* You can't create a promise in render of the component you will use it in, but the parent is okay*/}
                    <LazyLoadedTitle
                      employeeDetailsPromise={fetchEmployee(employee.id)}
                    />
                  </Suspense>
                ) : (
                  "Loading..."
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
