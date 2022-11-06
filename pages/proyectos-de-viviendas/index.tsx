import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Header,
  Button,
  Checkbox,
  Icon,
  Table,
  Dimmer, Loader, 
} from "semantic-ui-react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";

type projects = {
    id: number,
    name: string,
    address :string,
    constructors:{
      name: string,
    },
    contact: string,  
}

function index() {
  const router = useRouter();
  const [data, setData] = useState<projects[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);
  

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try{
      const response = await fetch(`http://127.0.0.1:8000/api/projects`, {
        headers: {
        'Accept': 'application/json',
      },
      });
      const json = await response.json();
      setData(json.data);
      setLoading(false);
    }catch(err){
      setError(err)
    }finally{
      setLoading(false)
    }
    setLoading(false);
  },[]);

  useEffect(() => {
    fetchProjects().catch(console.error);
  }, []);

  const handleDeleteProject = async (id: number) =>{
    setLoading(true)
    try{
    const response = await fetch(`http://127.0.0.1:8000/api/projects/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    const json = await response.json();
    if(json.data.hasOwnProperty('id')){
      setData(data.filter((project) => project.id !== id));
      alert("proyecto eliminado con exíto")
    }
  }catch(err){
    setError(err)
  }finally{
    setLoading(false)
  }
    setLoading(false);
  }

  return (
    <>
      <Header as="h3" block>
        Modulo Proyectos de viviendas
      </Header>
      <Container>
        <h2 className={styles.tittle}>
          Proyectos de vivienda <Icon name="home" />
        </h2>
        <Table compact celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Interesados</Table.HeaderCell>
              <Table.HeaderCell>Nombre</Table.HeaderCell>
              <Table.HeaderCell>Dirección</Table.HeaderCell>
              <Table.HeaderCell>Constructora</Table.HeaderCell>
              <Table.HeaderCell>Contacto</Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.length > 0 &&
              data.map((project) => {
                return (
                  <Table.Row key={project.id}>
                    <Table.Cell collapsing>
                      <Button
                        floated="right"
                        icon
                        labelPosition="left"
                        primary
                        size="small"
                        onClick={() =>
                          router.push(
                            `proyectos-de-viviendas/interesados/proyecto/${project.id}`
                          )
                        }
                      >
                        <Icon name="users" />
                        Personas interesadas
                      </Button>
                    </Table.Cell>
                    <Table.Cell>{project.name}</Table.Cell>
                    <Table.Cell>{project.address}</Table.Cell>
                    <Table.Cell>{project.constructors.name}</Table.Cell>
                    <Table.Cell>{project.contact}</Table.Cell>
                    <Table.Cell
                      collapsing
                      className={styles.delete_container_cell}
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Icon name="trash" color="red" />
                    </Table.Cell>
                    <Table.Cell
                      collapsing
                      className={styles.edit_container_cell}
                      onClick={() =>
                        router.push(
                          `/proyectos-de-viviendas/editar-proyecto/${project.id}`
                        )
                      }
                    >
                      <Icon name="edit" />
                    </Table.Cell>
                  </Table.Row>
                );
              })
            
            }
            {!data.length && 
            <Table.Row>
              <Table.Cell colSpan="7" >
               <h1>No hay proyectos todavia, agrega alguno.</h1>
              </Table.Cell>
            </Table.Row>
            }
            {loading && 
            <Table.Row>
              <Table.Cell colSpan="7" >
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              </Table.Cell>
            </Table.Row>
            }
          </Table.Body>

          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan="7">
                <Button
                  floated="right"
                  icon
                  labelPosition="left"
                  primary
                  size="small"
                  onClick={() =>
                    router.push("/proyectos-de-viviendas/crear-proyecto")
                  }
                >
                  <Icon name="home" /> Crear un nuevo proyecto
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Container>
    </>
  );
}

export default index;
