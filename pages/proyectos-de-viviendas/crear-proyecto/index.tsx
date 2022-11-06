import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { Header, Form, Button, Container, Select, Icon, Dimmer, Loader,  } from 'semantic-ui-react'
import { useRouter } from "next/router";
import {useFetchConstructors} from "../../../hooks/useFetchConstructors";

interface Iconstructors {
  key: number,
  text: string,
  value:number,
} 

interface IprojectValues {
  name: string,
  address: string,
  constructors_id: string,
  contact: string,
}

function index() {
    const router = useRouter();
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
    const [errorPost, setErrorPost] = useState<any>();
    const {data,loading,error} = useFetchConstructors('http://127.0.0.1:8000/api/constructors')
    const [constructors, setConstructors] = useState<Iconstructors[]>([]);
    const [projectValues, setprojectValues] = useState<IprojectValues>({
      name:'',
      address:'',
      constructors_id:'',
      contact:'',
    });
    useEffect(() => {
      setConstructors(
        data?.map((constructor, index:number)=>{
            return { key: constructor.id, text: constructor.name, value: constructor.id }
        })
      )
    },[data])

    const handleChangeForm = (key:string, value: any) => {
      setprojectValues(
        {...projectValues, [key]: value}
      )
    }

    const handleChangeForm_select = (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
      const { name, value } = data;
      console.log(name)
      setprojectValues(
        {...projectValues, [name]: value}
      )
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      let body = {
        name: projectValues.name,
        address: projectValues.address,
        constructors_id: projectValues.constructors_id,
        contact: projectValues.contact,
      }
      setLoadingPost(true)
        try{
          const response = await fetch(`http://127.0.0.1:8000/api/projects/create`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
          },
          body: JSON.stringify(body)
        });

        const json = await response.json();
        if(json.data.hasOwnProperty('id')){
          alert("proyecto creado con exíto")
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
      <h2>Crear un proyecto de vivienda <Icon name="home"/></h2>
    <Form onSubmit={(e) => handleSubmitForm(e)}>
      <Form.Field>
        <label>Nombre</label>
        <input required placeholder='Nombre' value={projectValues.name} onChange={(e) => handleChangeForm("name", e.target.value)}/>
      </Form.Field>
      <Form.Field>
        <label>Dirección</label>
        <input required placeholder='Dirección' value={projectValues.address} onChange={(e) => handleChangeForm("address", e.target.value)} />
      </Form.Field>
      <Form.Field
      required
        control={Select}
        options={constructors}
        label='Constructora'
        placeholder='Constructora'
        search
        searchInput={{ id: 'form-select-control-constructora' }}
        name="constructors_id"
        value={projectValues.constructors_id}
        onChange={handleChangeForm_select}
      />
      <Form.Field>
        <label>Contacto</label>
        <input required placeholder='Contacto' value={projectValues.contact} onChange={(e) => handleChangeForm("contact", e.target.value)} />
      </Form.Field>
      
      <Button primary type='submit'>Crear proyecto</Button>
      <Button onClick={() => router.back()} type='button'>Volver</Button>
    </Form>
    {loading || loadingPost &&
     <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    }
    </Container>
    </>
    );
}

export default index;