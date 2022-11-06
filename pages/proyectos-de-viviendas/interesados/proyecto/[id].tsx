import React, { useState, useEffect, useCallback } from "react";

import { Container, Header, Button, Checkbox, Icon, Table, Dimmer, Loader } from "semantic-ui-react";
import { useRouter } from "next/router";
import styles from "./styles.module.css"

interface data_interested_people_in_projects {
  id:number | null,
  interested_people:{
  id: number,
  name:string,
  contact:string,
  email:string,
  date_of_birth:string,
  city:string,
  }[]
}

function index() {
    const router = useRouter();
    const {id} = router.query;
    const [data, setData] = useState<data_interested_people_in_projects>({
      id:null,
      interested_people:[],
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any | null>(null);

    const fetchInterestedPeople = useCallback(async () => {
      try{
        setLoading(true)
        const response = await fetch(`http://127.0.0.1:8000/api/interesados/proyecto/${id}`,{
          method: 'GET',
          headers:{
            accpet:"application/json"
          }
        })

        const json = await response.json();
        console.log(json.data)
        setData(json.data)
      }catch(err){
        setError(err)
      }finally{
        setLoading(false)
      }
      setLoading(false)
    },[])

    useEffect(() => {

      if(id){
        fetchInterestedPeople().catch(console.error)
      }
    },[id])


    const handleDeleteInterestedPerson = async (id:number) => {
      setLoading(true)
      try{
      const response = await fetch(`http://127.0.0.1:8000/api/interesados/proyecto/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      const json = await response.json();
      if(json.data.hasOwnProperty('id')){
        setData({
          ...data,
          interested_people: data?.interested_people?.filter((interestedPerson) => interestedPerson.id !== id)
        });
        alert("Persona eliminada con exíto")
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
      <h2 onClick={() => router.back()} ><Icon name="arrow circle left"/> volver</h2>      
      <h2>Personas interesadas en el proyecto {data?.id}<Icon name="users"/></h2>
      <Table compact celled >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Nombre completo</Table.HeaderCell>
            <Table.HeaderCell>Número de teléfono</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Edad</Table.HeaderCell>
            <Table.HeaderCell>Ciudad</Table.HeaderCell>
            <Table.HeaderCell />
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
            {data?.interested_people?.length > 0 &&
              data?.interested_people.map((interestedPerson) => {
                return(
                <Table.Row key={interestedPerson.id}>
                  <Table.Cell>{interestedPerson.name}</Table.Cell>
                  <Table.Cell>{interestedPerson.contact}</Table.Cell>
                  <Table.Cell>{interestedPerson.email}</Table.Cell>
                  <Table.Cell>{interestedPerson.date_of_birth}</Table.Cell>
                  <Table.Cell>{interestedPerson.city}</Table.Cell>
                  <Table.Cell collapsing className={styles.delete_container_cell}>
                    <Icon name="trash" color="red" onClick={() => handleDeleteInterestedPerson(interestedPerson.id)}/>
                  </Table.Cell>
                  <Table.Cell collapsing className={styles.edit_container_cell} onClick={() => router.push(`/proyectos-de-viviendas/interesados/editar/${interestedPerson.id}`)}>
                    <Icon name="edit" />
                  </Table.Cell>
                </Table.Row>
                )
              })
            }
        </Table.Body>
        {loading && 
            <Table.Row>
              <Table.Cell colSpan="7" >
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              </Table.Cell>
            </Table.Row>
            }
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan="7">
              <Button
                floated="right"
                icon
                labelPosition="left"
                primary
                size="small"
                onClick={() => router.push("/proyectos-de-viviendas/interesados/agregar")}
              >
                <Icon name="user" /> Agregar un nuevo interesado
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
