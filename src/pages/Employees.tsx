import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { FilterInput } from "@/components/FilterInput";
import {
  ChevronDown,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTelegram } from "@/hooks/useTelegram";
import { getUser, User as AppUser } from "@/services/userService";

interface Employee {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  department: string;
  location: string;
  startDate: string;
  isManager?: boolean;
  isDepartmentHead?: boolean;
}

interface SubDepartment {
  id: string;
  name: string;
  manager: Employee;
  employees: Employee[];
}

interface Department {
  id: string;
  name: string;
  manager?: Employee;
  subDepartments?: SubDepartment[];
  employees?: Employee[];
  expanded?: boolean;
}

const mockDepartments: Department[] = [
  {
    id: "b2c",
    name: "B2C клиенты",
    manager: {
      id: "head-1",
      name: "Александр Иванов",
      position: "Директор B2C",
      phone: "+7 (495) 123-45-60",
      email: "aleksandr.ivanov@company.com",
      department: "B2C клиенты",
      location: "Москва, офис 1",
      startDate: "15.01.2018",
      isDepartmentHead: true,
    },
    subDepartments: [
      {
        id: "bfu-sales",
        name: "BFU Продажи",
        manager: {
          id: "manager-1",
          name: "Анна Петрова",
          position: "Директор по продажам",
          phone: "+7 (495) 123-45-67",
          email: "anna.petrova@company.com",
          department: "BFU Продажи",
          location: "Москва, офис 1",
          startDate: "15.03.2020",
          isManager: true,
        },
        employees: [
          {
            id: "emp-1",
            name: "Сергей Иванов",
            position: "Менеджер по продажам",
            phone: "+7 (495) 123-45-68",
            email: "sergey.ivanov@company.com",
            department: "BFU Продажи",
            location: "Москва, офис 1",
            startDate: "22.06.2021",
          },
          {
            id: "emp-2",
            name: "Мария Сидорова",
            position: "Менеджер по продажам",
            phone: "+7 (495) 123-45-69",
            email: "maria.sidorova@company.com",
            department: "BFU Продажи",
            location: "Москва, офис 1",
            startDate: "10.09.2022",
          },
        ],
      },
      {
        id: "bfu-service",
        name: "BFU Клиентский сервис",
        manager: {
          id: "manager-2",
          name: "Елена Волкова",
          position: "Руководитель клиентского сервиса",
          phone: "+7 (495) 123-45-70",
          email: "elena.volkova@company.com",
          department: "BFU Клиентский сервис",
          location: "Москва, офис 1",
          startDate: "01.08.2019",
          isManager: true,
        },
        employees: [
          {
            id: "emp-3",
            name: "Дмитрий Козлов",
            position: "Специалист клиентского сервиса",
            phone: "+7 (495) 123-45-71",
            email: "dmitry.kozlov@company.com",
            department: "BFU Клиентский сервис",
            location: "Москва, офис 1",
            startDate: "14.05.2021",
          },
        ],
      },
      {
        id: "bfu-activation",
        name: "BFU Отдел активации и подключения",
        manager: {
          id: "manager-3",
          name: "Виктор Петров",
          position: "Руководитель отдела активации",
          phone: "+7 (495) 123-45-72",
          email: "viktor.petrov@company.com",
          department: "BFU Отдел активации и подключения",
          location: "Москва, офис 1",
          startDate: "12.04.2020",
          isManager: true,
        },
        employees: [
          {
            id: "emp-4",
            name: "Ольга Николаева",
            position: "Специалист по активации",
            phone: "+7 (495) 123-45-73",
            email: "olga.nikolaeva@company.com",
            department: "BFU Отдел активации и подключения",
            location: "Москва, офис 1",
            startDate: "08.07.2022",
          },
        ],
      },
    ],
  },
  {
    id: "b2b",
    name: "B2B Клиенты",
    manager: {
      id: "head-2",
      name: "Михаил Смирнов",
      position: "Директор B2B",
      phone: "+7 (495) 123-45-74",
      email: "mikhail.smirnov@company.com",
      department: "B2B Клиенты",
      location: "Москва, офис 2",
      startDate: "01.03.2017",
      isDepartmentHead: true,
    },
    employees: [
      {
        id: "emp-5",
        name: "Алексей Семенов",
        position: "Менеджер по корпоративным продажам",
        phone: "+7 (495) 123-45-75",
        email: "alexey.semenov@company.com",
        department: "B2B Клиенты",
        location: "Москва, офис 2",
        startDate: "15.09.2021",
      },
      {
        id: "emp-6",
        name: "Татьяна Морозова",
        position: "Специалист по работе с корпоративными клиентами",
        phone: "+7 (495) 123-45-76",
        email: "tatyana.morozova@company.com",
        department: "B2B Клиенты",
        location: "Москва, офис 2",
        startDate: "03.11.2020",
      },
    ],
  },
  {
    id: "cfu-finance",
    name: "CFU финансы",
    manager: {
      id: "head-3",
      name: "Наталья Соколова",
      position: "Финансовый директор",
      phone: "+7 (495) 123-45-77",
      email: "natalya.sokolova@company.com",
      department: "CFU финансы",
      location: "Москва, офис 1",
      startDate: "12.02.2016",
      isDepartmentHead: true,
    },
    employees: [
      {
        id: "emp-7",
        name: "Игорь Лебедев",
        position: "Главный бухгалтер",
        phone: "+7 (495) 123-45-78",
        email: "igor.lebedev@company.com",
        department: "CFU финансы",
        location: "Москва, офис 1",
        startDate: "25.06.2019",
      },
    ],
  },
  {
    id: "cfu-it",
    name: "CFU IT",
    manager: {
      id: "head-4",
      name: "Андрей Кузнецов",
      position: "IT директор",
      phone: "+7 (495) 123-45-79",
      email: "andrey.kuznetsov@company.com",
      department: "CFU IT",
      location: "Москва, офис 2",
      startDate: "08.01.2015",
      isDepartmentHead: true,
    },
    employees: [
      {
        id: "emp-8",
        name: "Максим Федоров",
        position: "Системный администратор",
        phone: "+7 (495) 123-45-80",
        email: "maxim.fedorov@company.com",
        department: "CFU IT",
        location: "Москва, офис 2",
        startDate: "14.10.2021",
      },
      {
        id: "emp-9",
        name: "Екатерина Новикова",
        position: "Frontend разработчик",
        phone: "+7 (495) 123-45-81",
        email: "ekaterina.novikova@company.com",
        department: "CFU IT",
        location: "Москва, офис 2",
        startDate: "18.04.2022",
      },
    ],
  },
];

export default function Employees() {
  const { telegramId } = useTelegram();
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState(mockDepartments);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (selectedEmployee) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedEmployee]);

  useEffect(() => {
    if (telegramId) {
      const fetchUser = async () => {
        try {
          const user = await getUser(telegramId);
          setUserData(user);
          setUserError(null);
        } catch (err) {
          setUserError("Ошибка загрузки данных пользователя");
          console.error(err);
        } finally {
          setUserLoading(false);
        }
      };
      fetchUser();
    } else {
      setUserLoading(false);
    }
  }, [telegramId]);

  const toggleDepartment = (departmentId: string) => {
    setDepartments(prev =>
      prev.map(dept =>
        dept.id === departmentId ? { ...dept, expanded: !dept.expanded } : dept
      )
    );
  };

  const showEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const closeEmployeeDetails = () => {
    setSelectedEmployee(null);
  };

  const matchesSearch = (text: string) =>
    text.toLowerCase().includes(searchQuery.toLowerCase());

  const filteredDepartments = departments
    .map(dept => {
      const deptMatches =
        matchesSearch(dept.name) ||
        (dept.manager && (matchesSearch(dept.manager.name) || matchesSearch(dept.manager.position)));

      let hasMatchingContent = deptMatches;

      const filteredSubDepartments = dept.subDepartments?.map(subDept => {
        const subDeptMatches =
          matchesSearch(subDept.name) ||
          matchesSearch(subDept.manager.name) ||
          matchesSearch(subDept.manager.position);

        const filteredEmployees = subDept.employees.filter(
          emp => matchesSearch(emp.name) || matchesSearch(emp.position)
        );

        if (subDeptMatches || filteredEmployees.length > 0) {
          hasMatchingContent = true;
        }

        return {
          ...subDept,
          employees: searchQuery ? filteredEmployees : subDept.employees,
        };
      });

      const filteredDirectEmployees = dept.employees?.filter(
        emp => matchesSearch(emp.name) || matchesSearch(emp.position)
      );

      if (filteredDirectEmployees && filteredDirectEmployees.length > 0) {
        hasMatchingContent = true;
      }

      if (!searchQuery || hasMatchingContent) {
        return {
          ...dept,
          subDepartments: filteredSubDepartments,
          employees: searchQuery ? filteredDirectEmployees : dept.employees,
        };
      }

      return null;
    })
    .filter(Boolean) as Department[];

  return (
    <Layout userRole={(userData?.role || "user") as "admin" | "user"}>
      <div className="h-full flex flex-col">
        {/* Page Header */}
        <div className="bg-white border-b border-app-border-light px-4 py-4">
          <FilterInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск сотрудников..."
          />
        </div>

        {/* Employee List */}
        <div className="flex-1 overflow-y-auto p-4">
          {userLoading ? (
            <div className="h-full flex items-center justify-center">
              <div>Загрузка данных пользователя...</div>
            </div>
          ) : userError ? (
            <div className="h-full flex items-center justify-center text-red-500">
              {userError}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDepartments.map(department => (
                <div
                  key={department.id}
                  className="bg-white rounded-xl border border-app-border-light shadow-sm overflow-hidden"
                >
                  {/* Department Header */}
                  <div
                    className="p-4 border-b border-app-border-light cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDepartment(department.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {department.expanded ? (
                          <ChevronDown size={20} className="text-app-text-light" />
                        ) : (
                          <ChevronRight size={20} className="text-app-text-light" />
                        )}
                        <h3 className="text-lg font-semibold text-app-text">
                          {department.name}
                        </h3>
                      </div>
                      <span className="text-sm text-app-text-light">
                        {department.subDepartments
                          ? department.subDepartments.reduce(
                            (total, sub) => total + sub.employees.length + 1,
                            department.manager ? 1 : 0
                          )
                          : (department.employees?.length || 0) + (department.manager ? 1 : 0)}{" "}
                        сотрудников
                      </span>
                    </div>
                  </div>

                  {/* Department Content */}
                  {department.expanded && (
                    <div className="p-4">
                      {/* Department Head */}
                      {department.manager && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-app-text-light mb-2">
                            Директор отдела
                          </h4>
                          <div
                            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-app-primary/10 to-app-primary/5 rounded-lg cursor-pointer hover:from-app-primary/20 hover:to-app-primary/10 transition-colors border border-app-primary/20"
                            onClick={() => showEmployeeDetails(department.manager!)}
                          >
                            <div className="w-12 h-12 bg-gradient-to-r from-app-primary to-app-primary/80 rounded-full flex items-center justify-center">
                              <Crown size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-app-text">
                                {department.manager.name}
                              </p>
                              <p className="text-sm text-app-text-light">
                                {department.manager.position}
                              </p>
                            </div>
                            <ChevronRight size={16} className="text-app-text-light" />
                          </div>
                        </div>
                      )}

                      {/* Sub Departments */}
                      {department.subDepartments && (
                        <div className="space-y-4">
                          {department.subDepartments.map(subDept => (
                            <div
                              key={subDept.id}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <h5 className="font-medium text-app-text mb-3">
                                {subDept.name}
                              </h5>

                              {/* Sub Department Manager */}
                              <div className="mb-3">
                                <h6 className="text-xs font-medium text-app-text-light mb-2">
                                  Руководитель
                                </h6>
                                <div
                                  className="flex items-center space-x-3 p-3 bg-app-accent/5 rounded-lg cursor-pointer hover:bg-app-accent/10 transition-colors"
                                  onClick={() => showEmployeeDetails(subDept.manager)}
                                >
                                  <div className="w-10 h-10 bg-app-accent rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                      {subDept.manager.name
                                        .split(" ")
                                        .map(n => n[0])
                                        .join("")}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-app-text">
                                      {subDept.manager.name}
                                    </p>
                                    <p className="text-sm text-app-text-light">
                                      {subDept.manager.position}
                                    </p>
                                  </div>
                                  <ChevronRight size={16} className="text-app-text-light" />
                                </div>
                              </div>

                              {/* Sub Department Employees */}
                              {subDept.employees.length > 0 && (
                                <div>
                                  <h6 className="text-xs font-medium text-app-text-light mb-2">
                                    Сотрудники
                                  </h6>
                                  <div className="space-y-2">
                                    {subDept.employees.map(employee => (
                                      <div
                                        key={employee.id}
                                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => showEmployeeDetails(employee)}
                                      >
                                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                          <User size={16} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-app-text">
                                            {employee.name}
                                          </p>
                                          <p className="text-sm text-app-text-light">
                                            {employee.position}
                                          </p>
                                        </div>
                                        <ChevronRight size={16} className="text-app-text-light" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Direct Department Employees */}
                      {department.employees && department.employees.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-app-text-light mb-2">
                            Сотрудники
                          </h4>
                          <div className="space-y-2">
                            {department.employees.map(employee => (
                              <div
                                key={employee.id}
                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => showEmployeeDetails(employee)}
                              >
                                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                  <User size={16} className="text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-app-text">
                                    {employee.name}
                                  </p>
                                  <p className="text-sm text-app-text-light">
                                    {employee.position}
                                  </p>
                                </div>
                                <ChevronRight size={16} className="text-app-text-light" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employee Details Modal */}
        {selectedEmployee && (
          <div
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
            style={{ paddingBottom: '64px' }}
            onClick={closeEmployeeDetails}
          >
            <div
              className="bg-white w-full max-w-md rounded-t-xl"
              style={{ maxHeight: 'calc(100vh - 64px)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-app-border-light">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-app-text">
                    Информация о сотруднике
                  </h3>
                  <button
                    onClick={closeEmployeeDetails}
                    className="text-app-text-light hover:text-app-text transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Employee Avatar and Name */}
                <div className="text-center">
                  <div
                    className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3",
                      selectedEmployee.isDepartmentHead
                        ? "bg-gradient-to-r from-app-primary to-app-primary/80"
                        : selectedEmployee.isManager
                          ? "bg-app-accent"
                          : "bg-gray-400",
                    )}
                  >
                    {selectedEmployee.isDepartmentHead ? (
                      <Crown size={24} className="text-white" />
                    ) : (
                      <span className="text-white text-xl font-bold">
                        {selectedEmployee.name
                          .split(" ")
                          .map(n => n[0])
                          .join("")}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-semibold text-app-text">
                    {selectedEmployee.name}
                  </h4>
                  <p className="text-app-text-light">
                    {selectedEmployee.position}
                  </p>
                  <div className="flex justify-center space-x-2 mt-2">
                    {selectedEmployee.isDepartmentHead && (
                      <span className="inline-block mt-2 px-2 py-1 bg-app-primary/10 text-app-primary text-xs font-medium rounded-full">
                        Директор отдела
                      </span>
                    )}
                    {selectedEmployee.isManager && (
                      <span className="inline-block mt-2 px-2 py-1 bg-app-accent/10 text-app-accent text-xs font-medium rounded-full">
                        Руководитель
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone size={18} className="text-app-accent" />
                    <div>
                      <p className="text-sm text-app-text-light">Телефон</p>
                      <p className="text-app-text">{selectedEmployee.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail size={18} className="text-app-accent" />
                    <div>
                      <p className="text-sm text-app-text-light">Email</p>
                      <p className="text-app-text">{selectedEmployee.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin size={18} className="text-app-accent" />
                    <div>
                      <p className="text-sm text-app-text-light">
                        Местоположение
                      </p>
                      <p className="text-app-text">
                        {selectedEmployee.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar size={18} className="text-app-accent" />
                    <div>
                      <p className="text-sm text-app-text-light">
                        Дата начала работы
                      </p>
                      <p className="text-app-text">
                        {selectedEmployee.startDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Department Info */}
                <div className="p-3 bg-app-primary/5 rounded-lg">
                  <p className="text-sm text-app-text-light">Отдел</p>
                  <p className="font-medium text-app-text">
                    {selectedEmployee.department}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}