PGDMP      .    
        	    |            project_tracker    16.2    16.2     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    51402    project_tracker    DATABASE     �   CREATE DATABASE project_tracker WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE project_tracker;
                postgres    false            �            1259    51409    Projects    TABLE       CREATE TABLE public."Projects" (
    id integer NOT NULL,
    name character varying(255),
    status character varying(255),
    progress double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Projects";
       public         heap    postgres    false            �            1259    51408    Projects_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Projects_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Projects_id_seq";
       public          postgres    false    217            �           0    0    Projects_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Projects_id_seq" OWNED BY public."Projects".id;
          public          postgres    false    216            �            1259    51403    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public         heap    postgres    false            �            1259    51418    Tasks    TABLE       CREATE TABLE public."Tasks" (
    id integer NOT NULL,
    name character varying(255),
    status character varying(255),
    weight integer,
    "projectId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Tasks";
       public         heap    postgres    false            �            1259    51417    Tasks_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Tasks_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Tasks_id_seq";
       public          postgres    false    219            �           0    0    Tasks_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Tasks_id_seq" OWNED BY public."Tasks".id;
          public          postgres    false    218            Y           2604    51412    Projects id    DEFAULT     n   ALTER TABLE ONLY public."Projects" ALTER COLUMN id SET DEFAULT nextval('public."Projects_id_seq"'::regclass);
 <   ALTER TABLE public."Projects" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            Z           2604    51421    Tasks id    DEFAULT     h   ALTER TABLE ONLY public."Tasks" ALTER COLUMN id SET DEFAULT nextval('public."Tasks_id_seq"'::regclass);
 9   ALTER TABLE public."Tasks" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219            �          0    51409    Projects 
   TABLE DATA           Z   COPY public."Projects" (id, name, status, progress, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    217   R       �          0    51403    SequelizeMeta 
   TABLE DATA           /   COPY public."SequelizeMeta" (name) FROM stdin;
    public          postgres    false    215   �       �          0    51418    Tasks 
   TABLE DATA           b   COPY public."Tasks" (id, name, status, weight, "projectId", "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    219          �           0    0    Projects_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Projects_id_seq"', 4, true);
          public          postgres    false    216            �           0    0    Tasks_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Tasks_id_seq"', 9, true);
          public          postgres    false    218            ^           2606    51416    Projects Projects_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "Projects_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Projects" DROP CONSTRAINT "Projects_pkey";
       public            postgres    false    217            \           2606    51407     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public            postgres    false    215            `           2606    51425    Tasks Tasks_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Tasks"
    ADD CONSTRAINT "Tasks_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Tasks" DROP CONSTRAINT "Tasks_pkey";
       public            postgres    false    219            �   r   x�m̱�0й�
v��}���ov6~ K5�����I瓜���r�/�N�8O�N�`l�v��l�H���Ea�E
���G�����Z�m��b��!!H��l
a)�6���O"�      �   7   x�3202140aS#���ĒT݂�������b.#d�0%��� �=... {��      �   �   x�mй�0���������������� 
�DJ���!��zFϳ3�k����_��810����5|#�,*L9��*�#1P"�N̦�NE��RF"v��L1�O�`�ˬ�#�rh8jH�Z��S���ԁr{��>�{8�V)w����SE6}�%?D��=���O���r��y���I�$-�@�=���n�Z     