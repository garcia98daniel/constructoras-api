import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import { Header, Form, Button, Container, Select, 
  Dimmer, Loader, 
 } from "semantic-ui-react";
import { useRouter } from "next/router";
import { useFetchConstructors } from "../../../hooks/useFetchConstructors";

interface Iconstructors {
  key:number,
  text:string,
  value:number
}

interface IprojectValues{
  id?:number,
  name: string;
  address: string;
  constructors_id: string;
  contact: string;
}
function index() {
  const router = useRouter();
  const { id } = router.query;
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
  const [errorEdit, setErrorEdit] = useState<any>();
  const { data, loading, error } = useFetchConstructors(
    "http://127.0.0.1:8000/api/constructors"
  );
  const [constructors, setConstructors] = useState<Iconstructors[]>([]);
  const [projectValues, setProjectValues] = useState<IprojectValues>({
    name: "",
    address: "",
    constructors_id: "",
    contact: "",
  });

  useEffect(() => {
    setConstructors(
      data?.map((constructors, index) => {
        return {
          key: constructors.id,
          text: constructors.name,
          value: constructors.id,
        };
      })
    );
  }, [data]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/projects/${id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );
        const json = await response.json();
          console.log(json.data.name);
          setProjectValues({
            name: json.data.name,
            address: json.data.address,
            constructors_id: json.data.constructors_id,
            contact: json.data.contact,
          });
      } catch (err) {
        setErrorEdit(err);
      } finally {
        setLoadingEdit(false);
      }
      setLoadingEdit(false);
    };
    if(id){
      fetchProject().catch(console.error);
    }
  }, [id]);

  const handleChangeForm_select = (event:React.ChangeEvent<HTMLInputElement>, data: any) => {
    const { name, value } = data;
    console.log(name);
    setProjectValues({ ...projectValues, [name]: value });
  };

  const handleChangeForm = (key: string, value:any) => {
    setProjectValues(
      {...projectValues, [key]: value}
    )
  }

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let body = {
      id: id,
      name: projectValues.name,
      address: projectValues.address,
      constructors_id: projectValues.constructors_id,
      contact: projectValues.contact,
    };
    setLoadingEdit(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/projects/edit?_method=patch`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const json = await response.json();
      if (json.data.hasOwnProperty("id")) {
        alert("proyecto editado con exíto");
        router.back();
      }
    } catch (err) {
      setErrorEdit(err);
    } finally {
      setLoadingEdit(false);
    }
    setLoadingEdit(false);
  };

  return (
    <>
      <Header as="h3" block>
        Modulo Proyectos de viviendas
      </Header>
      <Container>
        <h2>Editar proyecto {projectValues.id}</h2>
        <Form onSubmit={(e) => handleSubmitForm(e)}>
          <Form.Field>
            <label>Nombre</label>
            <input
            required
              placeholder="Nombre"
              value={projectValues.name}
              onChange={(e) => handleChangeForm("name", e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Dirección</label>
            <input
            required
              placeholder="Dirección"
              value={projectValues.address}
              onChange={(e) => handleChangeForm("address", e.target.value)}
            />
          </Form.Field>
          <Form.Field
          required
            control={Select}
            options={constructors}
            label='Constructora'
            placeholder="Constructora"
            search
            searchInput={{ id: "form-select-control-constructora" }}
            name="constructors_id"
            value={projectValues.constructors_id}
            onChange={handleChangeForm_select}
          />
          <Form.Field>
            <label>Contacto</label>
            <input
            required
              placeholder="Contacto"
              value={projectValues.contact}
              onChange={(e) => handleChangeForm("contact", e.target.value)}
            />
          </Form.Field>
          {loading && 
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
            }
          <Button primary type="submit">
            Guardar
          </Button>
          <Button onClick={() => router.back()} type="button">
            Volver
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default index;
