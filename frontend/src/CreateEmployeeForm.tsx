import { useState } from "react";
import { Employee } from "./employee";

export default function CreateEmployeeForm({
  handleAddEmployee,
}: {
  handleAddEmployee: (newEmployee: Omit<Employee, "id">) => void;
}) {
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id">>({
    firstName: "",
    lastName: "",
    middleName: "",
    title: "",
  });

  return (
    <form
      className="employeeFormGrid"
      onSubmit={(event) => {
        handleAddEmployee({
          ...newEmployee,
          middleName:
            newEmployee.middleName !== "" ? newEmployee.middleName : null,
        });
        setNewEmployee({
          firstName: "",
          lastName: "",
          middleName: "",
          title: "",
        });

        event.preventDefault();
      }}
    >
      <label>First Name:</label>
      <input
        required
        value={newEmployee.firstName}
        onChange={(event) =>
          setNewEmployee({
            ...newEmployee,
            firstName: event.currentTarget.value,
          })
        }
      />
      <label>Middle Name:</label>
      <input
        value={newEmployee.middleName ?? ""}
        onChange={(event) =>
          setNewEmployee({
            ...newEmployee,
            middleName: event.currentTarget.value,
          })
        }
      />
      <label>Last Name:</label>
      <input
        required
        value={newEmployee.lastName ?? ""}
        onChange={(event) =>
          setNewEmployee({
            ...newEmployee,
            lastName: event.currentTarget.value,
          })
        }
      />
      <label>Title:</label>
      <input
        required
        value={newEmployee.title ?? ""}
        onChange={(event) =>
          setNewEmployee({
            ...newEmployee,
            title: event.currentTarget.value,
          })
        }
      />
      <button className="submit" type="submit">
        Submit
      </button>
    </form>
  );
}
