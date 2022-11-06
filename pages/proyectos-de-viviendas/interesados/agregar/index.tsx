import React, { useState, useEffect, useCallback } from "react";

import Head from 'next/head'
import Image from 'next/image'
import { Container, Header, Button, Checkbox, Icon, Table, Dimmer, Loader, Select, Form } from "semantic-ui-react";
import {useFetchConstructors} from "../../../../hooks/useFetchConstructors"
import { useRouter } from "next/router";

interface project {
  key: number,
  text: string,
  value: number,
}

interface Idata {
    id:number,
    name:string,
}

function index() {
  const router = useRouter();
  const [data, setData] = useState<Idata[]>([]);
  const [loadingPost, setLoadingPost] = useState<boolean>(false);
  const [errorPost, setErrorPost] = useState<any>(null);
  const [projectOptions, setProjectOptions] = useState<project[]>([]);
  const [InterestedPersonFormValues, setInterestedPersonFormValues] = useState({
        name: '',
        email: '',
        projects_id: '',
        contact: '',
        date_of_birth: '',
        city: '',
  });
  
  useEffect(() => {
    setData(data);
    setProjectOptions(
      data?.map((project, index)=>{
          return { key: project.id, text: project.name, value: project.id }
      })
    )
  },[data])

  const fetchProjects = useCallback(async () => {
    setLoadingPost(true);
    try{
        const response = await fetch(`http://127.0.0.1:8000/api/projects`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const json = await response.json();
        // console.log(json.data)
        setData(json.data);
        setLoadingPost(false);
      }catch(err){
        setErrorPost(err)
      }finally{
        setLoadingPost(false)
      }
      setLoadingPost(false);
  },[]);

  useEffect(() => {
    fetchProjects().catch(console.error);
  }, []);
  
  const handleChangeForm_select = (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
    const { name, value } = data;
    setInterestedPersonFormValues(
      {...InterestedPersonFormValues, [name]: value}
    )
  };

  const handleChangeForm = (key:string, value:any) => {
    setInterestedPersonFormValues(
      {...InterestedPersonFormValues, [key]: value}
    )
  }


  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPost(true)
    let body = {
        name: InterestedPersonFormValues.name,
        email: InterestedPersonFormValues.email,
        projects_id: InterestedPersonFormValues.projects_id,
        contact: InterestedPersonFormValues.contact,
        date_of_birth: InterestedPersonFormValues.date_of_birth,
        city: InterestedPersonFormValues.city,
    }
      try{
        const response = await fetch(`http://127.0.0.1:8000/api/interesados/create`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const json = await response.json();
      if(json.data.hasOwnProperty('id')){
        alert("Usuario agregado a la lista de interesados con exíto")
        router.back();
      }
    }catch(err){
      setErrorPost(err)
    }finally{
      setLoadingPost(false)
    }
    setLoadingPost(false);
  };

    return (
        <>
    <Header as='h3' block>
    Modulo Proyectos de viviendas
    </Header>
    <Container>
      <h2>Agregar a un usuario interesado</h2>
    <Form onSubmit={(e) => handleSubmitForm(e)}>
      <Form.Field>
        <label>Nombre completo</label>
        <input required placeholder='Nombre completo' value={InterestedPersonFormValues.name} onChange={(e) => handleChangeForm("name", e.target.value)}/>
      </Form.Field>
      <Form.Field>
        <label>Número de teléfono</label>
        <input placeholder='Número de teléfono' value={InterestedPersonFormValues.contact} onChange={(e) => handleChangeForm("contact", e.target.value)}/>
      </Form.Field>
      <Form.Field>
        <label>Email</label>
        <input required placeholder='Número de teléfono' value={InterestedPersonFormValues.email} onChange={(e) => handleChangeForm("email", e.target.value)}/>
      </Form.Field>
      <Form.Field
      required
        control={Select}
        options={projectOptions}
        label='proyecto'
        placeholder='proyecto'
        search
        searchInput={{ id: 'form-select-control-proyecto' }}
        name="projects_id"
        value={InterestedPersonFormValues.projects_id}
        onChange={handleChangeForm_select}
      />
      <Form.Input
              required
              placeholder="Fecha"
              label={<h4>Fecha de nacimiento</h4>}
              type="date"
              name="Fecha"
              id="date_of_birth"
            value={InterestedPersonFormValues.date_of_birth} onChange={(e) => handleChangeForm("date_of_birth", e.target.value)}
            />
      <Form.Field>
        <label>Ciudad</label>
        <input required placeholder='Ciudad'
        value={InterestedPersonFormValues.city} onChange={(e) => handleChangeForm("city", e.target.value)} />
      </Form.Field>
      {loadingPost &&
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      }
      <Button primary type='submit'>Agregar interesado</Button>
      <Button onClick={() => router.back()} type='submit'>Volver</Button>
    </Form>
    </Container>
    </>
    );
}

export default index;